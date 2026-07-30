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

func (e *YtDlpExecutor) DownloadMedia(url, outputTemplate string, format string, quality string) error {
	var binPath string
	if _, err := exec.LookPath("yt-dlp"); err == nil {
		binPath = "yt-dlp"
	} else {
		return fmt.Errorf("yt-dlp binary not found")
	}

	var args []string
	if format == "mp4" || format == "webm" {
		// Video mode
		var formatArg string
		if quality == "" || quality == "best" {
			formatArg = "bestvideo+bestaudio/best"
		} else {
			formatArg = fmt.Sprintf("bestvideo[height<=%s]+bestaudio/best[height<=%s]", quality, quality)
		}
		args = []string{binPath, "-f", formatArg, "--merge-output-format", format, "--embed-metadata", "--embed-thumbnail", "--js-runtimes", "node", "-o", outputTemplate, url}
	} else {
		// Audio mode
		ytFmt := format
		if format == "ogg" {
			ytFmt = "vorbis"
		}
		// ponytail: wav can't embed thumbnail, skip it
		args = []string{binPath, "-x", "--audio-format", ytFmt, "--embed-metadata", "--js-runtimes", "node", "-o", outputTemplate, url}
		if format != "wav" {
			args = append(args[:1], append([]string{"--embed-thumbnail"}, args[1:]...)...)
		}
	}

	cmd := exec.Command(args[0], args[1:]...)
	output, err := cmd.CombinedOutput()
	if err != nil {
		log.Printf("yt-dlp Error: %v\nOutput: %s", err, string(output))
		return fmt.Errorf("failed to download audio")
	}
	return nil
}
