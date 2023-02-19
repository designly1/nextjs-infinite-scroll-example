import React, { useState, useEffect, useLayoutEffect } from 'react'
import Head from 'next/head'
import { Inter } from '@next/font/google'
import axios from 'axios'
import uuid from 'react-uuid'

const inter = Inter({ subsets: ['latin'] })
const scrollThreshold = 1.2;

export default function Home({ products }) {
  const [scrollItems, setScrollItems] = useState([]);
  const [scrollIndex, setScrollIndex] = useState(3);

  const Product = ({ product }) => {
    if (product) {
      const curr = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      });
      return (
        <div className="product">
          <h2>{product.title}</h2>
          <h3>{curr.format(product.price)}</h3>
          <img src={product.image} alt={product.title} />
        </div>
      )
    }
  }

  useLayoutEffect(() => {
    const main = document.querySelector('main');
    const ele = document.querySelector('#products-bottom');
    const handleScroll = () => {
      const mainPos = main.scrollTop;
      const elePos = ele.getBoundingClientRect().y;
      if ((elePos * scrollThreshold) < mainPos) {
        handleScrollItems();
      }
    }

    main.addEventListener('scroll', handleScroll)

    return () => main.removeEventListener('scroll', handleScroll)
  })

  useEffect(() => {
    const setInitialItems = () => {
      setScrollItems([
        <Product key={uuid()} product={products[0]} />,
        <Product key={uuid()} product={products[1]} />,
        <Product key={uuid()} product={products[2]} />
      ]);
    }
    setInitialItems();
  }, [products])

  const handleScrollItems = () => {
    if (scrollIndex + 1 >= scrollIndex.length) return;

    const moreItems = [];
    moreItems.push(
      <Product key={uuid()} product={products[scrollIndex]} />,
      <Product key={uuid()} product={products[scrollIndex + 1]} />
    );
    setScrollIndex(oldVal => oldVal + 2);
    setScrollItems(scrollItems => [...scrollItems, moreItems]);
  }

  return (
    <>
      <Head>
        <title>NextJS Infinite Scroll Example</title>
        <meta name="description" content="NextJS infinite scroll example by Designly." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={inter.className}>
        <div className="container">
          <h1 style={{ textAlign: 'center' }}>Products Catalog</h1>
          {scrollItems}
          <div id="products-bottom"></div>
        </div>
      </main>
    </>
  )
}

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
