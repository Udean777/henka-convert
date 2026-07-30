package executor

import (
	"fmt"
	"log"
	"os/exec"
)

type FFmpegExecutor struct{}

func NewFFmpegExecutor() *FFmpegExecutor {
	return &FFmpegExecutor{}
}

func (f *FFmpegExecutor) ConvertVideo(inputPath, outputPath string) error {
	var binPath string
	if _, err := exec.LookPath("ffmpeg"); err == nil {
		binPath = "ffmpeg"
	} else {
		return fmt.Errorf("FFmpeg binary not found")
	}

	cmd := exec.Command(binPath, "-y", "-i", inputPath, outputPath)
	output, err := cmd.CombinedOutput()
	if err != nil {
		log.Printf("FFmpeg Error: %v\nOutput: %s", err, string(output))
		return fmt.Errorf("conversion failed")
	}
	return nil
}
