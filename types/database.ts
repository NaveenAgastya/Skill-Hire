export interface Profile {
  id: string
  email: string
  display_name: string | null
  full_name: string | null
  role: "client" | "laborer"
  created_at: string
  address: string | null
  profile_completed: boolean
}

export interface LaborProfile {
  id: string
  user_id: string
  hourly_rate: number
  bio: string | null
  experience: string | null
  skills: string[]
  city: string | null
  phone: string | null
  id_proof_url: string | null
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  title: string
  description: string
  location: string
  status: "pending" | "accepted" | "in_progress" | "completed" | "cancelled"
  booking_date: string
  start_time: string
  end_time: string | null
  estimated_hours: number
  hourly_rate: number
  total_amount: number
  client_id: string
  laborer_id: string
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  booking_id: string
  amount: number
  transaction_id: string
  payment_method: string
  status: "pending" | "completed" | "failed" | "refunded"
  created_at: string
  updated_at: string
}

export interface PaymentMethod {
  id: string
  user_id: string
  provider: string
  payment_method_id: string
  card_last4: string | null
  card_brand: string | null
  card_exp_month: number | null
  card_exp_year: number | null
  is_default: boolean
  created_at: string
}

export interface Tracking {
  id: string
  booking_id: string
  laborer_id: string
  latitude: number
  longitude: number
  status: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  sender_id: string
  recipient_id: string
  booking_id: string | null
  content: string
  is_read: boolean
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  is_read: boolean
  created_at: string
}

export interface Review {
  id: string
  booking_id: string
  reviewer_id: string
  reviewee_id: string
  rating: number
  comment: string | null
  created_at: string
}
