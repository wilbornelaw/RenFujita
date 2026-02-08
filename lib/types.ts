export type Visibility = "PUBLIC" | "PRIVATE";

export type ExifPayload = {
  camera?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  shutter?: string;
  iso?: string;
  location?: string;
};

export type Photo = {
  id: string;
  user_id: string;
  image_url: string;
  title: string;
  description: string | null;
  date_posted: string;
  tags: string[];
  copyright_notice: string;
  visibility: Visibility;
  exif: ExifPayload;
  created_at: string;
  updated_at: string;
};

export type Album = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  cover_photo_id: string | null;
  visibility: Visibility;
  created_at: string;
  updated_at: string;
};

export type AlbumPhoto = {
  album_id: string;
  photo_id: string;
  sort_order: number;
};
