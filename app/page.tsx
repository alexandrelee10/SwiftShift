import NavBar from './components/Navigation/LandingNavbar'
import ipads from '../public/assets/homepage/ipads.png'
import Image from 'next/image'
import GetStarted from './components/getStarted'
import Link from 'next/link'

const HomePage = () => {
  return (
    <div className='min-h-screen bg-gradient-to-b from-white via-zinc-50 to-zinc-100'>
      <NavBar />

      <section className='max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-20'>
        <div className='grid grid-cols-1 md:grid-cols-2 items-center gap-16'>
          
          {/* LEFT */}
          <div className='self-start'>
            
            {/* Badge */}
            <p className='inline-flex items-center text-xs font-semibold tracking-widest uppercase text-blue-700 bg-blue-50 px-4 py-2 rounded-full mb-6'>
              Smart load access
            </p>

            {/* Heading */}
            <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 leading-[1.1]'>
              Move freight faster <br className='hidden md:block' />
              with smarter tools
            </h1>

            {/* Subtext */}
            <p className='mt-6 text-lg md:text-xl text-zinc-600 max-w-xl leading-relaxed'>
              SwiftShift gives carriers and brokers real-time access to loads,
              helping you move efficiently without the clutter of outdated systems.
            </p>

            {/* CTA */}
            <div className='mt-10 flex flex-col sm:flex-row gap-4'>
              <Link href="/sign-in">
                <button className='bg-zinc-900 text-white px-7 py-3 rounded-xl font-medium hover:bg-zinc-800 transition shadow-sm'>
                  Sign In
                </button>
              </Link>

              <Link href="/sign-up">
                <button className='border border-zinc-300 text-zinc-800 px-7 py-3 rounded-xl font-medium hover:bg-white transition'>
                  Get Started
                </button>
              </Link>
            </div>

          </div>

          {/* RIGHT */}
          <div className='relative flex justify-center'>
            
            {/* Glow */}
            <div className='absolute w-[400px] h-[400px] bg-blue-200 blur-3xl rounded-full opacity-40'></div>

            {/* Image Card */}
            <div className='relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-zinc-200 p-6 md:p-10'>
              <Image
                src={ipads}
                alt='SwiftShift dashboard preview'
                className='w-full h-auto object-contain'
                priority
              />
            </div>

          </div>
        </div>
      </section>

      {/* Divider */}
      <div className='border-t border-zinc-200 max-w-7xl mx-auto'></div>

      {/* Get Started Section */}
      <section className='max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16'>
        <GetStarted />
      </section>
    </div>
  )
}

export default HomePage