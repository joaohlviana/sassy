import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  return NextResponse.json(
    { error: "Stripe configuration missing" },
    { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      }
    }
  );
}

import { stripe } from "@/libs/stripe";
import PaymentService from "@/services/payment";
import { loadTranslationsSSR } from "@/utils/loadTranslationsSSR";
import {
  InputData,
  transformPurchasePlansDTO,
} from "@/utils/transformPurchasePlansDTO";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const locale = (await cookieStore).get("locale")?.value || "en-US";

    const { translate } = await loadTranslationsSSR(locale);
    const { searchParams } = new URL(request.url);
    const currency = searchParams.get("currency");

    if (!currency) {
      return NextResponse.json(
        { error: "Missing Currency" },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    const paymentService = new PaymentService(stripe);
    const prices = await paymentService.listActivePrices();

    if (!prices) {
      return NextResponse.json(
        { error: "No prices found" },
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    const response = prices.map((price) => {
      const product = price.product as Stripe.Product;
      return {
        id: price.id,
        productName: product.name,
        description: product.description,
        interval: price.recurring?.interval,
        amount: ((price.unit_amount || 0) / 100).toFixed(0),
        currency: price.currency,
      };
    });

    const transform = await transformPurchasePlansDTO(
      response as Array<InputData>,
      translate,
      currency as string
    );

    return NextResponse.json(transform, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
}