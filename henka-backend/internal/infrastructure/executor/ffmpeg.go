package executor

import (
	"context"
	"fmt"
	"log"
	"os/exec"
	"time"
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

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Minute)
	defer cancel()

	cmd := exec.CommandContext(ctx, binPath, "-y", "-i", inputPath, outputPath)
	output, err := cmd.CombinedOutput()
	if err != nil {
		log.Printf("FFmpeg Error: %v\nOutput: %s", err, string(output))
		return fmt.Errorf("conversion failed")
	}
	return nil
}
