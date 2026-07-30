package executor

import (
	"fmt"
	"log"
	"os/exec"
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

	cmd := exec.Command(binPath, inputPath, outputPath)
	output, err := cmd.CombinedOutput()
	if err != nil {
		log.Printf("ImageMagick Error: %v\nOutput: %s", err, string(output))
		return fmt.Errorf("image conversion failed")
	}
	return nil
}
