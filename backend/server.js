const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");

const app = express();
app.use(cors());
app.use(express.json());

// 🔑 coloque sua chave secreta aqui depois
const stripe = Stripe("SUA_CHAVE_SECRETA_AQUI");

app.post("/create-checkout", async (req, res) => {
  try {
    const { cart } = req.body;

    const line_items = cart.map(item => ({
      price_data: {
        currency: "brl",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.qty,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "pix"],
      line_items,
      mode: "payment",
      success_url: "https://seusite.com/sucesso",
      cancel_url: "https://seusite.com/cancelado",
    });

    res.json({ url: session.url });

  } catch (error) {
    console.log(error);
    res.status(500).send("Erro no checkout");
  }
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
