package main

import (
	"log"

	deliveryHttp "henka-backend/internal/delivery/http"
	"henka-backend/internal/infrastructure/executor"
	"henka-backend/internal/usecase"
)

func main() {
	// 1. Setup Infrastructure / Adapters (Database, OS Exec, etc)
	docExec := executor.NewLibreOfficeExecutor()
	vidExec := executor.NewFFmpegExecutor()
	ytExec := executor.NewYtDlpExecutor()

	// 2. Setup Usecases (Business Logic)
	converterUC := usecase.NewConverterUsecase(docExec, vidExec, ytExec)

	// 3. Setup Delivery Handlers (HTTP/REST)
	handler := deliveryHttp.NewConversionHandler(converterUC)

	// 4. Setup Router
	router := deliveryHttp.SetupRouter(handler)

	// 5. Start Server
	log.Println("Server Golang menyala dengan Clean Architecture di port :8080 🚀")
	router.Run(":8080")
}
