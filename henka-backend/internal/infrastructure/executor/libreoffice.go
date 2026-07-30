package executor

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/exec"
	"time"
)

type LibreOfficeExecutor struct{}

func NewLibreOfficeExecutor() *LibreOfficeExecutor {
	return &LibreOfficeExecutor{}
}

func (l *LibreOfficeExecutor) ConvertDocument(inputPath, outDir, targetFormat string) error {
	var binPath string
	if _, err := exec.LookPath("soffice"); err == nil {
		binPath = "soffice"
	} else if _, err := exec.LookPath("libreoffice"); err == nil {
		binPath = "libreoffice"
	} else if _, err := os.Stat("/Applications/LibreOffice.app/Contents/MacOS/soffice"); err == nil {
		binPath = "/Applications/LibreOffice.app/Contents/MacOS/soffice"
	} else {
		return fmt.Errorf("LibreOffice binary not found")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Minute)
	defer cancel()

	cmd := exec.CommandContext(ctx, binPath, "--headless", "--convert-to", targetFormat, "--outdir", outDir, inputPath)
	output, err := cmd.CombinedOutput()
	if err != nil {
		log.Printf("LibreOffice Error: %v\nOutput: %s", err, string(output))
		return fmt.Errorf("conversion failed")
	}
	return nil
}
