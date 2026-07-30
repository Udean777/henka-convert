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
	ConvertDocument(inputPath, outDir, targetFormat string) error
}

// ImageExecutor is the interface for ImageMagick operations
type ImageExecutor interface {
	ConvertImage(inputPath, outputPath string) error
}

// VideoExecutor is the interface for FFmpeg operations
type VideoExecutor interface {
	ConvertVideo(inputPath, outputPath string) error
}

type YouTubeExecutor interface {
	DownloadMedia(url, outputTemplate string, format string, quality string) error
}

type ConverterUsecase struct {
	docExec DocumentExecutor
	vidExec VideoExecutor
	ytExec  YouTubeExecutor
	imgExec ImageExecutor
}

func NewConverterUsecase(docExec DocumentExecutor, vidExec VideoExecutor, ytExec YouTubeExecutor, imgExec ImageExecutor) *ConverterUsecase {
	return &ConverterUsecase{
		docExec: docExec,
		vidExec: vidExec,
		ytExec:  ytExec,
		imgExec: imgExec,
	}
}

// ConvertGeneral mengorkestrasi alur konversi secara generik
func (uc *ConverterUsecase) ConvertGeneral(file *multipart.FileHeader, targetFormat string) (string, func(), error) {
	jobID := uuid.New().String()
	tmpDir := filepath.Join(os.TempDir(), "henka_convert", jobID)
	
	cleanup := func() {
		os.RemoveAll(tmpDir)
	}

	if err := os.MkdirAll(tmpDir, 0755); err != nil {
		return "", cleanup, fmt.Errorf("failed to create temp dir")
	}

	safeFilename := filepath.Base(file.Filename)
	inputPath := filepath.Join(tmpDir, safeFilename)
	if err := saveUploadedFile(file, inputPath); err != nil {
		return "", cleanup, err
	}

	ext := filepath.Ext(safeFilename)
	baseName := safeFilename[0 : len(safeFilename)-len(ext)]
	outputPath := filepath.Join(tmpDir, baseName+"."+targetFormat)
	
	sourceExt := ext
	if len(sourceExt) > 0 {
	    sourceExt = sourceExt[1:]
	}

	isMedia := false
	isDoc := false
	
	mediaExts := []string{"mp4", "webm", "gif", "avi", "mov", "mkv", "wmv", "flv", "m4v", "3gp", "ts", "vob", "mp3", "wav", "flac", "aac", "m4a", "ogg", "wma", "mka", "ac3", "opus", "aiff", "amr", "au"}
	for _, e := range mediaExts {
	    if sourceExt == e {
	        isMedia = true
	        break
	    }
	}
	
	docExts := []string{"docx", "doc", "rtf", "txt", "odt", "html", "pdf", "xlsx", "xls", "ods", "csv", "pptx", "ppt", "odp"}
	for _, e := range docExts {
	    if sourceExt == e {
	        isDoc = true
	        break
	    }
	}

	var err error
	if isMedia {
	    err = uc.vidExec.ConvertVideo(inputPath, outputPath)
	} else if isDoc {
	    err = uc.docExec.ConvertDocument(inputPath, tmpDir, targetFormat)
	} else {
	    // Assume image
	    err = uc.imgExec.ConvertImage(inputPath, outputPath)
	}

	if err != nil {
		return "", cleanup, err
	}

	if _, err := os.Stat(outputPath); os.IsNotExist(err) {
		return "", cleanup, fmt.Errorf("output file not found")
	}

	return outputPath, cleanup, nil
}

func (uc *ConverterUsecase) ConvertYouTubeURL(url string, format string, quality string) (string, func(), error) {
	jobID := uuid.New().String()
	tmpDir := filepath.Join(os.TempDir(), "henka_yt", jobID)
	
	cleanup := func() {
		os.RemoveAll(tmpDir)
	}

	if err := os.MkdirAll(tmpDir, 0755); err != nil {
		return "", cleanup, fmt.Errorf("failed to create temp dir")
	}

	outputTemplate := filepath.Join(tmpDir, "%(title)s.%(ext)s")
	if err := uc.ytExec.DownloadMedia(url, outputTemplate, format, quality); err != nil {
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
