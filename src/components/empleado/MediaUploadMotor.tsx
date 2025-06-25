'use client'

import { useState, useRef, useEffect } from 'react'

interface MediaUploadMotorProps {
  mediaFiles: File[]
  setMediaFiles: (files: File[]) => void
}

export default function MediaUploadMotor({ mediaFiles, setMediaFiles }: MediaUploadMotorProps) {
  const [dragActive, setDragActive] = useState(false)
  const [previews, setPreviews] = useState<{ [key: string]: string }>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ✅ Limpiar URLs de objeto cuando se desmonte el componente o cambien los archivos
  useEffect(() => {
    return () => {
      Object.values(previews).forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url)
        }
      })
    }
  }, [previews])

  const handleFiles = (files: FileList | null) => {
    if (!files) return

    const validFiles: File[] = []
    const newPreviews: { [key: string]: string } = { ...previews }
    
    Array.from(files).forEach(file => {
      // ✅ Validación mejorada de tipos de archivo
      const isValidImage = file.type.match(/^image\/(jpeg|jpg|png|gif|webp)$/i)
      const isValidVideo = file.type.match(/^video\/(mp4|mov|avi|wmv|flv|webm)$/i)
      
      if (isValidImage || isValidVideo) {
        // ✅ Validación de tamaño (ejemplo: máximo 50MB)
        const maxSize = 50 * 1024 * 1024 // 50MB
        if (file.size > maxSize) {
          alert(`El archivo "${file.name}" es demasiado grande. Máximo permitido: 50MB`)
          return
        }

        // Verificar duplicados de manera más robusta
        const isDuplicate = mediaFiles.some(existingFile => 
          existingFile.name === file.name && 
          existingFile.size === file.size &&
          existingFile.lastModified === file.lastModified
        )
        
        if (!isDuplicate) {
          validFiles.push(file)
          
          // Crear preview solo para imágenes
          if (isValidImage) {
            const fileKey = `${file.name}-${file.size}-${file.lastModified}`
            newPreviews[fileKey] = URL.createObjectURL(file)
          }
        } else {
          console.warn(`Archivo duplicado ignorado: ${file.name}`)
        }
      } else {
        alert(`Tipo de archivo no soportado: ${file.name}\nSolo se permiten imágenes (JPG, PNG, GIF, WebP) y videos (MP4, MOV, AVI, WMV, FLV, WebM)`)
      }
    })

    if (validFiles.length > 0) {
      setMediaFiles([...mediaFiles, ...validFiles])
      setPreviews(newPreviews)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
    // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
    e.target.value = ''
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  const removeFile = (index: number) => {
    const fileToRemove = mediaFiles[index]
    const fileKey = `${fileToRemove.name}-${fileToRemove.size}-${fileToRemove.lastModified}`
    
    // ✅ Limpiar URL del preview
    if (previews[fileKey]) {
      URL.revokeObjectURL(previews[fileKey])
      const newPreviews = { ...previews }
      delete newPreviews[fileKey]
      setPreviews(newPreviews)
    }
    
    const newFiles = mediaFiles.filter((_, i) => i !== index)
    setMediaFiles(newFiles)
  }

  const clearAllFiles = () => {
    // ✅ Limpiar todas las URLs de preview
    Object.values(previews).forEach(url => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url)
      }
    })
    setPreviews({})
    setMediaFiles([])
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return '🖼️'
    } else if (file.type.startsWith('video/')) {
      return '🎥'
    }
    return '📄'
  }

  const getPreviewUrl = (file: File) => {
    const fileKey = `${file.name}-${file.size}-${file.lastModified}`
    return previews[fileKey] || null
  }

  // ✅ Calcular tamaño total de archivos
  const totalSize = mediaFiles.reduce((acc, file) => acc + file.size, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Multimedia del Motor</h3>
        {mediaFiles.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 bg-blue-100 px-3 py-1 rounded-full">
              {mediaFiles.length} archivo{mediaFiles.length !== 1 ? 's' : ''}
            </span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {formatFileSize(totalSize)}
            </span>
          </div>
        )}
      </div>

      {/* Zona de subida de archivos */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,video/mp4,video/mov,video/avi,video/wmv,video/flv,video/webm"
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-lg font-medium text-gray-700">
              {dragActive ? 'Suelta los archivos aquí' : 'Arrastra archivos aquí o haz clic para seleccionar'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Imágenes y videos • Máximo 50MB por archivo
            </p>
          </div>
          <button
            type="button"
            className="mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            Seleccionar Archivos
          </button>
        </div>
      </div>

      {/* Lista de archivos seleccionados */}
      {mediaFiles.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Archivos seleccionados:</h4>
          <div className="grid gap-4 max-h-96 overflow-y-auto">
            {mediaFiles.map((file, index) => {
              const previewUrl = getPreviewUrl(file)
              return (
                <div key={`${file.name}-${file.size}-${index}`} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border">
                  {/* Preview de imagen */}
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt={file.name}
                      className="w-16 h-16 object-cover rounded-lg border"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-2xl">
                      {getFileIcon(file)}
                    </div>
                  )}
                  
                  {/* Información del archivo */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(file.size)} • {file.type.split('/')[1]?.toUpperCase() || 'Unknown'}
                    </p>
                    {file.lastModified && (
                      <p className="text-xs text-gray-400">
                        {new Date(file.lastModified).toLocaleString()}
                      </p>
                    )}
                  </div>
                  
                  {/* Botón eliminar */}
                  <button
                    onClick={() => removeFile(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar archivo"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )
            })}
          </div>
          
          {/* Botón para limpiar todos los archivos */}
          <div className="flex justify-end">
            <button
              onClick={clearAllFiles}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Limpiar todos los archivos
            </button>
          </div>
        </div>
      )}

      {/* Información adicional */}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
        <p className="font-medium mb-1">📋 Información:</p>
        <ul className="space-y-1">
          <li>• Los archivos se subirán automáticamente al registrar el motor</li>
          <li>• Imágenes: JPG, PNG, GIF, WebP</li>
          <li>• Videos: MP4, MOV, AVI, WMV, FLV, WebM</li>
          <li>• Tamaño máximo por archivo: 50MB</li>
          <li>• Puedes seleccionar múltiples archivos a la vez</li>
        </ul>
      </div>
    </div>
  )
}