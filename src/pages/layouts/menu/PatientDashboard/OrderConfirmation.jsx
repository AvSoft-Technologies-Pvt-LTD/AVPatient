import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { CheckCircle, Package, Truck, Clock, MapPin } from 'lucide-react';


const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const { state } = useLocation();
  const [localOrder, setLocalOrder] = useState(state?.order);

  useEffect(() => {
    if (localOrder && localOrder.status === 'pending') {
      setTimeout(() => {
        setLocalOrder(prev => ({
          ...prev,
          status: 'confirmed',
          timeline: [
            ...prev.timeline,
            {
              status: 'confirmed',
              timestamp: new Date().toISOString(),
              description: 'Order confirmed by system',
            },
          ],
        }));
      }, 2000);

      setTimeout(() => {
        setLocalOrder(prev => ({
          ...prev,
          status: 'processing',
          timeline: [
            ...prev.timeline,
            {
              status: 'processing',
              timestamp: new Date().toISOString(),
              description: 'Order is being packed',
            },
          ],
        }));
      }, 5000);
    }
  }, [localOrder]);

  if (!localOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h2>
          <Link to="/dashboard/shopping" className="text-[var(--primary-color)] hover:text-[var(--accent-color)]">
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'processing':
        return <Package className="h-6 w-6 text-[var(--primary-color)]" />;
      case 'dispatched':
      case 'in_transit':
        return <Truck className="h-6 w-6 text-purple-500" />;
      case 'delivered':
        return <MapPin className="h-6 w-6 text-green-600" />;
      default:
        return <Clock className="h-6 w-6 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-50';
      case 'processing':
        return 'text-[var(--primary-color)] bg-blue-50';
      case 'dispatched':
      case 'in_transit':
        return 'text-purple-600 bg-purple-50';
      case 'delivered':
        return 'text-green-700 bg-green-100';
      default:
        return 'text-yellow-600 bg-yellow-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Order #{localOrder.orderId}
              </h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(localOrder.status)}`}>
                {localOrder.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Placed on {new Date(localOrder.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="p-6">
            {/* Order Items */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Items Ordered</h3>
              <div className="space-y-4">
                {localOrder.items.map((item) => (
                  <div key={item.product.id} className="flex items-center space-x-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                      <p className="text-sm text-gray-600">{item.product.brand}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{localOrder.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {localOrder.shipping === 0 ? 'Free' : `${localOrder.shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">₹{localOrder.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-semibold border-t pt-4">
                <span>Total</span>
                <span className="text-[var(--primary-color)]">₹{localOrder.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping & Tracking Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-[var(--primary-color)]" />
              Shipping Address
            </h3>
            <div className="text-gray-600">
              <p>{localOrder.shippingAddress.street}</p>
              <p>
                {localOrder.shippingAddress.city}, {localOrder.shippingAddress.state} {localOrder.shippingAddress.zipCode}
              </p>
              <p>{localOrder.shippingAddress.country}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Truck className="h-5 w-5 mr-2 text-[var(--primary-color)]" />
              Tracking Information
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Tracking Number:</span> {localOrder.trackingNumber}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Estimated Delivery:</span> {localOrder.estimatedDelivery}
              </p>
              <Link
                to={`/dashboard/track-order/${localOrder.id}`}
                state={{ order: localOrder }} className='text-[var(--accent-color)] font-medium hover:underline'
              >
                Track Your Order
              </Link>
            </div>
          </div>
        </div>

        {/* Order Timeline */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold mb-6">Order Timeline</h3>
          <div className="space-y-4">
            {localOrder.timeline.map((event, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {getStatusIcon(event.status)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 capitalize">
                    {event.status.replace('_', ' ')}
                  </p>
                  <p className="text-sm text-gray-600">{event.description}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(event.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/dashboard/shopping"
            className="px-6 py-3 bg-[var(--primary-color)] text-white rounded-lg font-medium hover:bg-[var(--accent-color)] text-center"
          >
            Continue Shopping
          </Link>
          <Link
            to="/dashboard/orders"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 text-center"
          >
            View All Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;