import peterbilt from "@/public/assets/getStarted/peterbilt.png"
import office from "@/public/assets/getStarted/office.png"
import shipping from "@/public/assets/getStarted/shipping.png"

import Link from "next/link"
import Image from "next/image"

const GetStarted = () => {

  const cardElements = [
    {
      title: "Carriers",
      image: peterbilt,
      href: "/carriers"
    },
    {
      title: "Brokers",
      image: office,
      href: "/brokers"
    },
    {
      title: "Shipping",
      image: shipping,
      href: "/shipping"
    },
  ]

  return (
    <div className='min-h-screen bg-zinc-100'>
      <section className='max-w-7xl mx-auto px-6 py-16'>
        
        <h1 className='text-3xl font-bold mb-10 text-zinc-900'>
          Get Started
        </h1>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {cardElements.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className='group'
            >
              <div className='bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition'>
                
                {/* Image */}
                <div className='h-48 relative'>
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className='object-cover group-hover:scale-105 transition duration-300'
                  />
                </div>

                {/* Text */}
                <div className='p-6'>
                  <h2 className='text-xl font-semibold text-zinc-800 group-hover:text-blue-600 transition'>
                    {card.title}
                  </h2>
                </div>

              </div>
            </Link>
          ))}
        </div>

      </section>
    </div>
  )
}

export default GetStarted