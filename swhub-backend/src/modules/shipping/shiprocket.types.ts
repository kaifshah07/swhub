export interface ShiprocketLoginRequest {
  email: string;
  password: string;
}

export interface ShiprocketLoginResponse {
  id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  company_id?: number;
  created_at?: string;
  token: string;
}

export interface ShiprocketServiceabilityCourier {
  courier_company_id: number;
  courier_name: string;
  rate: number;
  etd: string;
  estimated_delivery_days?: number | string;
  cod: number;
  is_surface?: boolean;
  min_weight?: number;
  call_courier?: number;
  rating?: number;
}

export interface ShiprocketServiceabilityResponse {
  status: number;
  data?: {
    available_courier_companies: ShiprocketServiceabilityCourier[];
    recommended_courier_company_id?: number;
    recommended_by?: string;
  };
  message?: string;
}

export interface ShiprocketOrderItem {
  name: string;
  sku: string;
  units: number;
  selling_price: number | string;
  discount?: number | string;
  tax?: number | string;
  hsn?: number | string;
}

export interface ShiprocketCreateOrderRequest {
  order_id: string;
  order_date: string;
  pickup_location: string;
  channel_id?: string;
  comment?: string;
  billing_customer_name: string;
  billing_last_name?: string;
  billing_address: string;
  billing_address_2?: string;
  billing_city: string;
  billing_pincode: string;
  billing_state: string;
  billing_country: string;
  billing_email: string;
  billing_phone: string;
  shipping_is_billing: boolean;
  shipping_customer_name?: string;
  shipping_last_name?: string;
  shipping_address?: string;
  shipping_address_2?: string;
  shipping_city?: string;
  shipping_pincode?: string;
  shipping_country?: string;
  shipping_state?: string;
  shipping_email?: string;
  shipping_phone?: string;
  order_items: ShiprocketOrderItem[];
  payment_method: "Prepaid" | "COD";
  shipping_charges?: number;
  giftwrap_charges?: number;
  transaction_charges?: number;
  total_discount?: number;
  sub_total: number;
  length: number;
  breadth: number;
  height: number;
  weight: number;
}

export interface ShiprocketCreateOrderResponse {
  order_id: number;
  shipment_id: number;
  status: string;
  status_code: number;
  onboarding_completed_now?: number;
  awb_code?: string;
  courier_company_id?: number;
  courier_name?: string;
}

export interface ShiprocketAssignAwbRequest {
  shipment_id: number | string;
  courier_id?: number | string;
  status?: string;
}

export interface ShiprocketAssignAwbResponse {
  awb_assign_status: number;
  response?: {
    data?: {
      courier_company_id?: number;
      awb_code?: string;
      courier_name?: string;
      routing_code?: string;
      applied_weight?: number;
      label?: string;
    };
  };
  message?: string;
}

export interface ShiprocketGenerateLabelRequest {
  shipment_id: Array<number | string>;
}

export interface ShiprocketGenerateLabelResponse {
  label_created?: number;
  label_url?: string;
  response?: string;
}

export interface ShiprocketPickupRequest {
  shipment_id: Array<number | string>;
  pickup_date?: string[];
}

export interface ShiprocketPickupResponse {
  pickup_status?: number;
  response?: {
    pickup_token_number?: string;
    status?: string;
    data?: any;
  };
  message?: string;
}

export interface ShiprocketTrackingActivity {
  date: string;
  status: string;
  activity: string;
  location: string;
  "sr-status"?: string;
}

export interface ShiprocketTrackingResponse {
  tracking_data?: {
    track_status?: number;
    shipment_status?: number;
    shipment_track?: Array<{
      id: number;
      awb_code: string;
      courier_name?: string;
      current_status: string;
      origin?: string;
      destination?: string;
      edd?: string;
    }>;
    shipment_track_activities?: ShiprocketTrackingActivity[];
    track_url?: string;
  };
  message?: string;
}

export interface ShiprocketWebhookPayload {
  awb?: string;
  awb_code?: string;
  order_id?: string;
  shipment_id?: number | string;
  current_status?: string;
  status?: string;
  courier_name?: string;
  current_timestamp?: string;
  location?: string;
  etd?: string;
  scans?: Array<{
    date: string;
    status: string;
    activity: string;
    location: string;
  }>;
}

export interface PackageDimensions {
  weight: number; // in kg
  length: number; // in cm
  breadth: number; // in cm
  height: number; // in cm
}

export interface ParsedAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
}
