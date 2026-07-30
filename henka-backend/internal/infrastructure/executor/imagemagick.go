package executor

import (
	"context"
	"fmt"
	"log"
	"os/exec"
	"time"
)

type ImageMagickExecutor struct{}

func NewImageMagickExecutor() *ImageMagickExecutor {
	return &ImageMagickExecutor{}
}

func (e *ImageMagickExecutor) ConvertImage(inputPath, outputPath string) error {
	var binPath string
	if _, err := exec.LookPath("convert"); err == nil {
		binPath = "convert" // ImageMagick v6
	} else if _, err := exec.LookPath("magick"); err == nil {
		binPath = "magick" // ImageMagick v7
	} else {
		return fmt.Errorf("ImageMagick binary not found")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Minute)
	defer cancel()

	cmd := exec.CommandContext(ctx, binPath, inputPath, outputPath)
	output, err := cmd.CombinedOutput()
	if err != nil {
		log.Printf("ImageMagick Error: %v\nOutput: %s", err, string(output))
		return fmt.Errorf("image conversion failed")
	}
	return nil
}
