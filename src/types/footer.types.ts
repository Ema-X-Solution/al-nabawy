export interface SocialLink {
  id: string
  platform: string
  url: string
  svgIcon: string
}

export interface FooterDocument {
  sloganEn: string
  sloganAr: string
  addressEn: string
  addressAr: string
  phone1: string
  phone2: string
  whatsapp: string
  email: string
  copyrightEn: string
  copyrightAr: string
  socialLinks: SocialLink[]
}
