import { Textarea } from "@/components/ui/textarea"

const page = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center text-center"> 
        <h1 className="text-3xl font-bold text-center my-18">Ai Playlist Songs</h1>
        <div className="my-4 space-y-5 p-4">
          <div className="text-purple-500 text-5xl font-bold">Create Playlist With Just a Prompt</div>
          <div className="font-semibold">Type a prompt, get lists of music</div>
        </div>

        {/* input field */}
        <div className="flex items-center justify-center w-full max-w-1/2 mx-4 mt-6">
          <Textarea className="h-40" placeholder="Ask xx to create playlist songs" />      
        </div>
      </div>
    </>
  )
}
export default page