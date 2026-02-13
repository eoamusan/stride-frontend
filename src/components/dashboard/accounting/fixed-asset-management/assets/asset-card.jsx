import { Info } from "lucide-react";

export default function AssetCard({ title, data = []}) {

  return (
    <>
      <div className="border border-gray-[#F0EEFF] rounded-2xl py-4 px-8 text-[#434343]">
        <div className="flex items-center space-x-3">
          <Info />
          <h2 className="font-semibold">{title}</h2>
        </div>
        { data?.component ? data.component : <div className="grid grid-cols-2 mt-4 gap-4">
          {
            data.map((item, index) => (
              <div key={index} className="flex flex-col">
                <h3 className="font-semibold">{ item.label }</h3>
                { item.type === 'component' ? <item.value /> : <span className="text-sm">{ item.value }</span> }
              </div>
            ))
          }
        </div>
        }
      </div>
    </>
  )
}