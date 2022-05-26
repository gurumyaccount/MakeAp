/* pages/_app.js */
import '../styles/globals.css'
import Link from 'next/link'

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav className="border-b p-6">
        <p className="text-6xl font-bold text-red-900">MakeAp</p>
        <div className="flex mt-4 flow-root">
          <p className="float-left">
            <Link href="/">
              <a className="mr-4 text-pink-500">
                MakeAp Market
              </a>
            </Link>

            <Link href="/my-nfts">
              <a className="mr-6 text-pink-500">
                My MakeAp Kit
              </a>
            </Link>
            <Link href="/dashboard">
              <a className="mr-6 text-pink-500">
                Dashboard
              </a>
            </Link>
            <Link href="/contest" >
              <a className="mr-6 text-pink-500">
                Contest
              </a>
            </Link>

            <Link href="/contest-manager" >
              <a className="mr-6 text-pink-500">
                Contest Manager
              </a>
            </Link>

          </p>
          <p className="float-right  ">
            <Link href="/voter-signup" >
              <a className="text-pink-500 text-2xl">
                Vote and Earn
              </a>
            </Link>
          </p>

        </div>

      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp