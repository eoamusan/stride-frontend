import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


export default function CustomBudgetForm() {
  return (
    <div className="space-y-2">
      <h2 className="text-white bg-primary px-4 py-1">Budget Template</h2>

      <div className="relative mb-3">
        <Input
          type="file"
          className="hidden"
          id="logo"
        />
        <label
          htmlFor="vat-certificate"
          className="border-input flex h-10 cursor-pointer items-center justify-between rounded-md border bg-white px-3 text-sm hover:bg-gray-50"
        >
          <span className="text-muted-foreground">
            {'No file chosen'}
          </span>
          <span className="rounded bg-gray-200 px-3 py-1 text-xs text-gray-700">
            Upload Logo
          </span>
        </label>
      </div>

      <h3 className="font-medium">Directions:</h3>
      <ol className="text-sm list-decimal list-inside">
        <li>Add your Expenses and the cost estimates for each item.</li>
        <li>Add the actual expenses for each item for the month.</li>
      </ol>
      <p className="space-y-28 text-sm">
        Note; Only add information to the blue cells. white cells will auto-calculate for you. <span className="text-red-500">Red text</span> means you are over budget, 
        <span className="text-primary">Purple text</span> means you are under / within budget
      </p>

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