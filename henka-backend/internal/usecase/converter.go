package usecase

import (
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"

	"github.com/google/uuid"
)

// DocumentExecutor is the interface for LibreOffice operations
type DocumentExecutor interface {
	ConvertToPDF(inputPath, outDir string) error
}

// VideoExecutor is the interface for FFmpeg operations
type VideoExecutor interface {
	ConvertVideo(inputPath, outputPath string) error
}

type YouTubeExecutor interface {
	DownloadAudio(url, outputTemplate string, format string) error
}

type ConverterUsecase struct {
	docExec DocumentExecutor
	vidExec VideoExecutor
	ytExec  YouTubeExecutor
}

func NewConverterUsecase(docExec DocumentExecutor, vidExec VideoExecutor, ytExec YouTubeExecutor) *ConverterUsecase {
	return &ConverterUsecase{
		docExec: docExec,
		vidExec: vidExec,
		ytExec:  ytExec,
	}
}

// ConvertDocument mengorkestrasi alur konversi dokumen:
// Membuat folder UUID -> Simpan file -> Panggil LibreOffice -> Kembalikan path output & fungsi cleanup
func (uc *ConverterUsecase) ConvertDocument(file *multipart.FileHeader) (string, func(), error) {
	jobID := uuid.New().String()
	tmpDir := filepath.Join(os.TempDir(), "henka_doc", jobID)
	
	cleanup := func() {
		os.RemoveAll(tmpDir)
	}

	if err := os.MkdirAll(tmpDir, 0755); err != nil {
		return "", cleanup, fmt.Errorf("failed to create temp dir")
	}

	inputPath := filepath.Join(tmpDir, file.Filename)
	if err := saveUploadedFile(file, inputPath); err != nil {
		return "", cleanup, err
	}

	if err := uc.docExec.ConvertToPDF(inputPath, tmpDir); err != nil {
		return "", cleanup, err
	}

	ext := filepath.Ext(file.Filename)
	baseName := file.Filename[0 : len(file.Filename)-len(ext)]
	outputPath := filepath.Join(tmpDir, baseName+".pdf")

	if _, err := os.Stat(outputPath); os.IsNotExist(err) {
		return "", cleanup, fmt.Errorf("output file not found")
	}

	return outputPath, cleanup, nil
}

// ConvertVideo mengorkestrasi alur konversi video menggunakan FFmpeg
func (uc *ConverterUsecase) ConvertVideo(file *multipart.FileHeader, targetFormat string) (string, func(), error) {
	jobID := uuid.New().String()
	tmpDir := filepath.Join(os.TempDir(), "henka_video", jobID)
	
	cleanup := func() {
		os.RemoveAll(tmpDir)
	}

	if err := os.MkdirAll(tmpDir, 0755); err != nil {
		return "", cleanup, fmt.Errorf("failed to create temp dir")
	}

	inputPath := filepath.Join(tmpDir, file.Filename)
	if err := saveUploadedFile(file, inputPath); err != nil {
		return "", cleanup, err
	}

	ext := filepath.Ext(file.Filename)
	baseName := file.Filename[0 : len(file.Filename)-len(ext)]
	outputPath := filepath.Join(tmpDir, baseName+"."+targetFormat)

	if err := uc.vidExec.ConvertVideo(inputPath, outputPath); err != nil {
		return "", cleanup, err
	}

	if _, err := os.Stat(outputPath); os.IsNotExist(err) {
		return "", cleanup, fmt.Errorf("output file not found")
	}

	return outputPath, cleanup, nil
}

func (uc *ConverterUsecase) ConvertYouTubeURL(url string, format string) (string, func(), error) {
	jobID := uuid.New().String()
	tmpDir := filepath.Join(os.TempDir(), "henka_yt", jobID)
	
	cleanup := func() {
		os.RemoveAll(tmpDir)
	}

	if err := os.MkdirAll(tmpDir, 0755); err != nil {
		return "", cleanup, fmt.Errorf("failed to create temp dir")
	}

	outputTemplate := filepath.Join(tmpDir, "%(title)s.%(ext)s")
	if err := uc.ytExec.DownloadAudio(url, outputTemplate, format); err != nil {
		return "", cleanup, err
	}

	files, err := os.ReadDir(tmpDir)
	if err != nil || len(files) == 0 {
		return "", cleanup, fmt.Errorf("output file not found")
	}

	// Assuming yt-dlp outputs exactly one file
	outputPath := filepath.Join(tmpDir, files[0].Name())
	return outputPath, cleanup, nil
}

// Helper untuk menyimpan multipart file ke filesystem
func saveUploadedFile(file *multipart.FileHeader, dst string) error {
	src, err := file.Open()
	if err != nil {
		return err
	}
	defer src.Close()

	out, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer out.Close()

	_, err = io.Copy(out, src)
	return err
}
