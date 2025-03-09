import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion, listRegions } from "@lib/data/regions"
import ProductTemplate from "@modules/products/templates"
import { createCommercetoolsClient } from "@lib/commercetools"
import { GET_PRODUCT_BY_SLUG } from "graphql/queries/getProductBySlug"
import Nav from "@modules/layout/templates/nav"
import ReactQueryProvider from "app/QueryClientProvider"
import { GET_FULL_PRODUCT_BY_SLUG } from "graphql/queries/getFullProductBySlug"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params


  const client= await createCommercetoolsClient()
  const data = await client.request(GET_PRODUCT_BY_SLUG, { key: params.handle });

  const product= data?.product?.masterData.current

  if (!product) {
    notFound()
  }

  return {
    title: `${product?.name} | Graco Store`,
    description: `${product?.description}`,
    openGraph: {
      title: `${product?.name} | Graco Store`,
      description: `${product?.description}`,
      images: product?.thumbnail ? [product?.thumbnail] : [], //need work
    },
  }
}

export default async function ProductPage(props: Props) {
  const params = await props.params

  const client= await createCommercetoolsClient()
  const data = await client.request(GET_FULL_PRODUCT_BY_SLUG, { key: params.handle });

  const product=data?.product?.masterData?.current
  console.log('ddddddddddddddddddddddda',product)

  // const region = await getRegion(params.countryCode)

  if (!product) {
    notFound()
  }

 

  return (
    <>
    <ReactQueryProvider><Nav/></ReactQueryProvider>
    <ProductTemplate
      product={{...product,id:data?.product?.id}}
      region={"us"}
      countryCode={"en-US"}
    />
    </>
  )
}
