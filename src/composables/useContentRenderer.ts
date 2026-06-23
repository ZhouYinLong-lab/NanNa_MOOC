import type { ContentType } from '@/types'

export function useContentRenderer() {
  function detectContentType(url: string, mimeType?: string): ContentType {
    if (mimeType) {
      if (mimeType.startsWith('video/')) return 'video'
      if (mimeType.startsWith('audio/')) return 'audio'
      if (mimeType.startsWith('image/')) return 'image'
      if (mimeType.includes('pdf') || mimeType.includes('document')) return 'attachment'
    }

    const ext = url.split('.').pop()?.toLowerCase()?.split('?')[0]
    switch (ext) {
      case 'mp4':
      case 'webm':
      case 'ogg':
      case 'mov':
        return 'video'
      case 'mp3':
      case 'wav':
      case 'flac':
      case 'aac':
        return 'audio'
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg':
      case 'webp':
        return 'image'
      case 'pdf':
      case 'doc':
      case 'docx':
      case 'ppt':
      case 'pptx':
      case 'xls':
      case 'xlsx':
      case 'zip':
      case 'rar':
        return 'attachment'
      case 'md':
        return 'markdown'
      default:
        return 'text'
    }
  }

  function getFileIcon(mimeType?: string): string {
    if (!mimeType) return '📎'
    if (mimeType.includes('pdf')) return '📄'
    if (mimeType.includes('word') || mimeType.includes('document')) return '📝'
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return '📊'
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return '🖥️'
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar')) return '📦'
    if (mimeType.includes('image')) return '🖼️'
    if (mimeType.includes('video')) return '🎬'
    if (mimeType.includes('audio')) return '🎵'
    return '📎'
  }

  return {
    detectContentType,
    getFileIcon,
  }
}
