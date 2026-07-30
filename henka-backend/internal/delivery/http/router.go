package http

import (
	"henka-backend/internal/delivery/middleware"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter(handler *ConversionHandler) *gin.Engine {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"}, // Di production sebaiknya diubah ke URL Vue Anda
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		ExposeHeaders:    []string{"Content-Length", "Content-Disposition"},
		AllowCredentials: true,
	}))

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"service": "henka-converter-engine-go",
		})
	})

	api := r.Group("/api")
	api.Use(middleware.RateLimitMiddleware())
	
	api.POST("/convert/document", handler.HandleDocument)
	api.POST("/convert/video", handler.HandleVideo)
	api.POST("/convert/youtube", handler.HandleYouTubeConvert)

	return r
}
