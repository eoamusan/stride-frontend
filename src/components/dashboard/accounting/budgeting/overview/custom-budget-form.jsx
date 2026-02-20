import { Button } from "@/components/ui/button";
import checker from '@/assets/images/checker.png';

export default function CustomBudgetForm() {
  return (
    <div className="space-y-2">
      <h2 className="text-white bg-primary px-4 py-1">Budget Template</h2>

      <div className="relative mb-3">
        <img src={checker} className="w-30" alt="No vendors" />
      </div>

      <h3 className="font-medium">Directions:</h3>
      <ol className="text-sm list-decimal list-inside">
        <li>Add your Expenses and the cost estimates for each item.</li>
        <li>Add the actual expenses for each item for the month.</li>
      </ol>
      <p className="space-y-28 text-sm">
        Note: Only add information to the blue cells. white cells will auto-calculate for you. <span className="text-red-500">Red text</span> means you are over budget, 
        <span className="text-primary">Purple text</span> means you are under / within budget
      </p>

      <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-4 bg-primary text-white text-sm font-medium">
          <div className="p-3 border-r whitespace-nowrap">Monthly Expenses</div>
          <div className="p-3 border-r">Category</div>
          <div className="p-3 border-r">Budget</div>
          <div className="p-3">Actual</div>
        </div>

        {/* Row */}
        <div className="grid grid-cols-4 text-sm border-t">
          <div className="p-3 border-r">John Doe</div>
          <div className="p-3 border-r">john@email.com</div>
          <div className="p-3 border-r">Admin</div>
          <div className="p-3">Active</div>
        </div>

      </div>

      <div className="flex justify-start space-x-4 pt-10 pb-5">
        <Button
          type="button"
          variant="outline"
          className="h-10 min-w-[130px] text-sm"
        >
          Back
        </Button>

        <Button
          type="submit"
          className="h-10 min-w-[195px] text-sm"
        >
          Create
        </Button>
      </div>
    </div>
  )
}