package executor

import (
	"fmt"
	"log"
	"os/exec"
)

type YtDlpExecutor struct{}

func NewYtDlpExecutor() *YtDlpExecutor {
	return &YtDlpExecutor{}
}

func (e *YtDlpExecutor) DownloadAudio(url, outputTemplate string, format string) error {
	var binPath string
	if _, err := exec.LookPath("yt-dlp"); err == nil {
		binPath = "yt-dlp"
	} else {
		return fmt.Errorf("yt-dlp binary not found")
	}

	cmd := exec.Command(binPath,
		"-x",
		"--audio-format", format,
		"--embed-metadata",
		"--embed-thumbnail",
		"--js-runtimes", "nodejs",
		"-o", outputTemplate,
		url)
	output, err := cmd.CombinedOutput()
	if err != nil {
		log.Printf("yt-dlp Error: %v\nOutput: %s", err, string(output))
		return fmt.Errorf("failed to download audio")
	}
	return nil
}
