export interface OrderItemDTO{

    productId:number;

    quantity:number;

}

export interface CreateOrderDTO {
  customerId?: number;
  address: string;
  paymentMethod: string;
  couponCode?: string;

  items: {
    productId: number;
    quantity: number;
  }[];
}