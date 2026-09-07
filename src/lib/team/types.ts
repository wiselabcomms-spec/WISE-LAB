export interface TeamMember {
  id: string
  name: string
  role: string
  tagline: string
  bio: string
  imageUrl: string
  linkedinUrl: string
  isFeatured: boolean
  sortOrder: number
  isVisible: boolean
  createdAt?: string
  updatedAt?: string
}
