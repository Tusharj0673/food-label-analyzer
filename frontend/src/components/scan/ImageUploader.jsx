import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent } from '@/components/ui/card'
import {
  Upload,
  Camera,
  Image as ImageIcon,
  X,
  Loader2,
  CheckCircle,
  Lock,
  ScanLine,
  Tag,
  Table,
  List
} from 'lucide-react'
import toast from 'react-hot-toast'

const imageSlots = [
  {
    id: 'front',
    label: 'Front Label',
    icon: Tag,
    required: true,
    hint: 'Required — front panel with claims'
  },
  {
    id: 'nutrition',
    label: 'Nutrition Table',
    icon: Table,
    required: false,
    hint: 'Optional but improves accuracy'
  },
  {
    id: 'ingredients',
    label: 'Ingredients List',
    icon: List,
    required: false,
    hint: 'Optional but improves accuracy'
  }
]

function SingleUploader({
  slot,
  file,
  preview,
  loading,
  onFileSelect,
  onRemove
}) {
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (loading) {
      toast.error('Cannot change images during analysis')
      return
    }

    if (rejectedFiles.length > 0) {
      toast.error('Only JPG, PNG, WEBP allowed')
      return
    }

    const selected = acceptedFiles[0]

    if (!selected) return

    if (selected.size > 10 * 1024 * 1024) {
      toast.error('Max file size is 10MB')
      return
    }

    onFileSelect(slot.id, selected)
  }, [loading, slot.id, onFileSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': []
    },
    maxFiles: 1,
    noClick: true,
    disabled: loading
  })

  const openPicker = (capture = false) => {
    if (loading) return

    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    if (capture) input.capture = 'environment'

    input.onchange = (e) => {
      const selected = e.target.files[0]
      if (!selected) return

      if (selected.size > 10 * 1024 * 1024) {
        toast.error('Max file size is 10MB')
        return
      }

      onFileSelect(slot.id, selected)
    }

    input.click()
  }

  const Icon = slot.icon

  return (
    <div className="space-y-2">

      {/* Label */}
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">{slot.label}</span>
        {slot.required
          ? <span className="text-xs text-red-500">*required</span>
          : <span className="text-xs text-muted-foreground">optional</span>
        }
      </div>

      {!preview ? (
        <>
          {/* Desktop */}
          <div
            {...getRootProps()}
            onClick={() => !loading && openPicker()}
            className={`hidden md:flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-10 transition ${
              loading
                ? 'opacity-60 cursor-not-allowed'
                : 'cursor-pointer'
            } ${
              isDragActive
                ? 'border-primary bg-primary/10'
                : 'border-gray-400 hover:border-primary hover:bg-primary/5'
            }`}
          >
            <input {...getInputProps()} />

            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-2">
              {loading
                ? <Lock className="h-5 w-5" />
                : <Upload className="h-5 w-5 text-primary" />
              }
            </div>

            <p className="text-xs text-muted-foreground text-center">
              {isDragActive ? 'Drop here' : slot.hint}
            </p>
          </div>

          {/* Mobile */}
          <div className="md:hidden grid grid-cols-2 gap-2">
            <button
              onClick={() => openPicker(true)}
              disabled={loading}
              className="p-3 border rounded-xl text-sm flex gap-2 justify-center"
            >
              <Camera className="h-4 w-4" /> Camera
            </button>
            <button
              onClick={() => openPicker(false)}
              disabled={loading}
              className="p-3 border rounded-xl text-sm flex gap-2 justify-center"
            >
              <ImageIcon className="h-4 w-4" /> Gallery
            </button>
          </div>
        </>
      ) : (
        <div className="relative border rounded-xl overflow-hidden">
          <img
            src={preview}
            alt=""
            className="w-full h-32 object-cover"
          />

          {!loading && (
            <button
              onClick={() => onRemove(slot.id)}
              className="absolute top-2 right-2 bg-white rounded-full p-1"
            >
              <X className="h-3 w-3" />
            </button>
          )}

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <Loader2 className="animate-spin" />
            </div>
          )}

          <div className="absolute bottom-0 w-full bg-black/50 text-white text-xs px-2 py-1 flex gap-1 items-center">
            <CheckCircle className="h-3 w-3 text-green-400" />
            {file?.name}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ImageUploader({
  files,
  previews,
  loading,
  onFileSelect,
  onRemove
}) {
  const uploadedCount = Object.values(previews).filter(Boolean).length

  return (
    <Card>
      <CardContent className="p-6 space-y-6">

        <h2 className="flex gap-2 items-center font-semibold">
          <ScanLine className="h-4 w-4" />
          Upload Label Images
        </h2>

        {/* Progress */}
        <div className="flex gap-2 items-center">
          <div className="flex-1 h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-primary rounded-full"
              style={{ width: `${(uploadedCount / 3) * 100}%` }}
            />
          </div>
          <span className="text-xs">{uploadedCount}/3</span>
        </div>

        {/* Slots */}
        <div className="grid md:grid-cols-3 gap-6">
          {imageSlots.map(slot => (
            <SingleUploader
              key={slot.id}
              slot={slot}
              file={files[slot.id]}
              preview={previews[slot.id]}
              loading={loading}
              onFileSelect={onFileSelect}
              onRemove={onRemove}
            />
          ))}
        </div>

      </CardContent>
    </Card>
  )
}

