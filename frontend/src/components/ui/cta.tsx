import { Button } from "@/components/ui/button"

export default function CTASection() {
  return (
    <section className="w-full py-12 md:py-20">
      <div className="w-full px-4 md:px-6">
        <div className="relative overflow-hidden bg-zinc-800 rounded-3xl p-8 md:p-12 lg:p-16">
          {/* Concentric circles pattern */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute right-0 bottom-0 -mb-24 -mr-24 w-[400px] h-[400px] rounded-full border-[40px] border-primary-foreground/10 opacity-20"></div>
            <div className="absolute right-0 bottom-0 -mb-16 -mr-16 w-[300px] h-[300px] rounded-full border-[30px] border-primary-foreground/20 opacity-20"></div>
            <div className="absolute right-0 bottom-0 -mb-8 -mr-8 w-[200px] h-[200px] rounded-full border-[20px] border-primary-foreground/30 opacity-20"></div>
          </div>

          <div className="relative z-10 max-w-3xl">
            <p className="text-lg md:text-xl font-medium text-white mb-3">Ready to collaborate?</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Start a campaign <span className="italic">today!</span>
            </h2>
            <Button
              size="lg"
              className="bg-black text-white hover:bg-white hover:text-black transition-all cursor-pointer"
            >
              Get Started →
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
