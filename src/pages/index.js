// index.js
import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { Inter } from '@next/font/google'
import axios from 'axios'
import uuid from 'react-uuid'
import Product from '@/components/Product'
import useInfiniteScroll from '@/hooks/useInfiniteScroll'

const inter = Inter({ subsets: ['latin'] })

export default function Home({ products }) {
  // Create state to store number of products to display
  const [displayProducts, setDisplayProducts] = useState(3);

  // Invoke our custom hook
  useInfiniteScroll({
    trackElement: '#products-bottom',
    containerElement: '#main'
  }, () => {
    setDisplayProducts(oldVal => oldVal + 3);
  });

  return (
    <>
      <Head>
        <title>NextJS Infinite Scroll Example</title>
        <meta name="description" content="NextJS infinite scroll example by Designly." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main id="main" className={inter.className}>
        <div className="container">
          <h1 style={{ textAlign: 'center' }}>Products Catalog</h1>
          {
            products.slice(0, displayProducts).map((product) => (
              <Product key={uuid()} product={product} />
            ))
          }
          <div id="products-bottom"></div>
        </div>
      </main>
    </>
  )
}

// Get our props from the remote API via ISR
export async function getStaticProps() {
  let products = [];

  try {
    const res = await axios.get('https://fakestoreapi.com/products');
    products = res.data;
  } catch (e) {
    console.error(e);
  }

  return {
    props: {
      products
    },
    revalidate: 10
  }
}
