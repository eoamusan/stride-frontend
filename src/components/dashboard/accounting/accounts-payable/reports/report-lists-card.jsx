import { Card } from '@/components/ui/card';

export default function ListCard({ title, items }) {
  return (
    <Card className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-base font-semibold">{title}</h2>
      </div>

      {/* Items */}
      <div className="space-y-6">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-2">
            {/* Color indicator */}
            <div className={`mt-2 h-2 w-2 rounded-full ${item.color}`} />

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold">{item.period}</h3>
                  <p className="text-sm text-[#434343]">
                    {item.invoiceCount > 0 && `${item.invoiceCount} invoices`} 
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{item.amount}</p>
                  <p className="text-sm text-[#434343]">{item.percentage}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
