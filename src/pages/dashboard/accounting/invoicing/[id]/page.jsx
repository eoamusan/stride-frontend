import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import PreviewInvoice from '@/components/dashboard/accounting/invoicing/preview-invoice';
import InvoiceService from '@/api/invoice';
import CustomerService from '@/api/customer';
import toast from 'react-hot-toast';
import { Spinner } from '@/components/ui/spinner';

export default function ViewInvoice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Transform API invoice data to form data for preview
  const transformToFormData = (invoice) => {
    if (!invoice) return null;

    return {
      id: invoice._id,
      invoice_number: invoice.invoiceNo,
      customerId:
        typeof invoice.customerId === 'string'
          ? invoice.customerId
          : invoice.customerId._id,
      currency: invoice.currency,
      category: invoice.category || 'Services',
      c_o: invoice.co || '',
      invoice_date: new Date(invoice.invoiceDate),
      term_of_payment: invoice.termsOfPayment || '2 days',
      due_date: new Date(invoice.dueDate),
      products: {
        products:
          invoice.product?.products?.map((product) => ({
            name: product.name || '',
            description: product.description || '',
            unit_price: product.unit_price || 0,
            quantity: product.quantity || 1,
            total_price: product.total_price || 0,
            vat_applicable:
              product.vat_applicable !== undefined
                ? product.vat_applicable
                : true,
          })) || [],
        banks: invoice.product?.banks || [],
        paymentGateways: invoice.product?.paymentGateways || [],
      },
      discount: parseFloat(invoice.product?.discount) || 0,
      status: invoice.status,
      vat: parseFloat(invoice.product?.vat) || 7.5,
      delivery_fee: parseFloat(invoice.product?.deliveryFee) || 0,
      terms: invoice.product?.terms || '',
      internal_notes: invoice.product?.notes || '',
      display_bank_details: invoice.product?.displayBankDetails || false,
      apply_signature: invoice.product?.applySignature || false,
    };
  };

  // Calculate subtotal for preview
  const calculateSubtotal = (products) => {
    if (!products || !Array.isArray(products)) return 0;
    return products.reduce((sum, product) => {
      const unitPrice = product.unitPrice || product.unit_price || 0;
      const quantity = product.quantity || 1;
      return sum + unitPrice * quantity;
    }, 0);
  };

  useEffect(() => {
    const fetchInvoiceAndCustomer = async () => {
      try {
        setIsLoading(true);
        const response = await InvoiceService.get({ id });

        let invoiceData = null;
        if (response.data?.data?.invoice) {
          invoiceData = response.data.data.invoice;
        } else if (response.data?.data) {
          // Fallback for old API structure
          invoiceData = response.data.data;
        } else {
          toast.error('Invoice not found');
          navigate('/dashboard/accounting/invoicing');
          return;
        }

        setInvoice(invoiceData);

        // Fetch customer data separately
        const customerId =
          typeof invoiceData.customerId === 'string'
            ? invoiceData.customerId
            : invoiceData.customerId?._id;

        if (customerId) {
          try {
            const customerResponse = await CustomerService.get({
              id: customerId,
            });
            console.log('customerResponse', customerResponse);
            if (customerResponse.data?.data?.customer) {
              setCustomer(customerResponse.data.data.customer);
            }
          } catch (error) {
            return error;
          }
        }
      } catch (error) {
        console.error('Error fetching invoice:', error);
        toast.error('Failed to load invoice');
        navigate('/dashboard/accounting/invoicing');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchInvoiceAndCustomer();
    }
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!invoice) {
    return null;
  }

  const formData = transformToFormData(invoice);

  console.log('customer in view invoice page', customer);

  return (
    <div className="my-4 min-h-screen">
      <PreviewInvoice
        formData={formData}
        calculateSubtotal={() => calculateSubtotal(invoice.product?.products)}
        onBack={() => navigate('/dashboard/accounting/invoicing')}
        onEdit={() => {
          navigate('/dashboard/accounting/invoicing/' + formData.id + '/edit');
        }}
        customers={[customer]}
      />
    </div>
  );
}
