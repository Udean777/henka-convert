package http

import (
	"fmt"
	"net/http"
	"path/filepath"

	"henka-backend/internal/usecase"

	"github.com/gin-gonic/gin"
)

type ConversionHandler struct {
	uc *usecase.ConverterUsecase
}

func NewConversionHandler(uc *usecase.ConverterUsecase) *ConversionHandler {
	return &ConversionHandler{uc: uc}
}

func (h *ConversionHandler) HandleConvert(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Tidak ada file yang diunggah"})
		return
	}

	// Security: Batasi ukuran file hingga 50MB
	if file.Size > 50*1024*1024 {
		c.JSON(http.StatusRequestEntityTooLarge, gin.H{"error": "Ukuran file maksimal 50MB"})
		return
	}

	targetFormat := c.PostForm("targetFormat")
	if targetFormat == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format target tidak valid"})
		return
	}

	outputPath, cleanup, err := h.uc.ConvertGeneral(file, targetFormat)
	defer cleanup() // Always clean up temporary directories!

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ext := filepath.Ext(file.Filename)
	baseName := file.Filename[0 : len(file.Filename)-len(ext)]
	
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s.%s\"", baseName, targetFormat))
	c.File(outputPath)
}

type YouTubeRequest struct {
	URL     string `json:"url"`
	Format  string `json:"format"`
	Quality string `json:"quality"`
}

func (h *ConversionHandler) HandleYouTubeConvert(c *gin.Context) {
	var req YouTubeRequest
	if err := c.ShouldBindJSON(&req); err != nil || req.URL == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "URL YouTube tidak valid"})
		return
	}

	if req.Format == "" {
		req.Format = "mp3"
	}

	outputPath, cleanup, err := h.uc.ConvertYouTubeURL(req.URL, req.Format, req.Quality)
	defer cleanup()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengunduh dan mengonversi video YouTube"})
		return
	}

	baseName := filepath.Base(outputPath)
	c.Header("Access-Control-Expose-Headers", "Content-Disposition")
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", baseName))
	c.File(outputPath)
}
