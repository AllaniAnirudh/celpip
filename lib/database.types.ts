export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
          has_used_free_test: boolean
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          updated_at?: string
          has_used_free_test?: boolean
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
          has_used_free_test?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "auth.users"
            referencedColumns: ["id"]
          }
        ]
      }
      writing_attempts: {
        Row: {
          id: string
          user_id: string | null
          task_type: string
          prompt: string
          response: string
          word_count: number
          time_spent: number
          score: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          task_type: string
          prompt: string
          response: string
          word_count: number
          time_spent: number
          score: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          task_type?: string
          prompt?: string
          response?: string
          word_count?: number
          time_spent?: number
          score?: Json
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "writing_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 