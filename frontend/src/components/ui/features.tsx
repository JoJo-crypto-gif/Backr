import { motion } from "framer-motion"
import {
  Rocket,
  Shield,
  BarChart3,
  Users,
  Smartphone,
  CreditCard,
} from "lucide-react"

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const features = [
  {
    icon: <Rocket className="h-6 w-6" />,
    title: "Easy Campaign Creation",
    description:
      "Launch your campaign in minutes with our intuitive campaign builder and customizable templates.",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Secure Payments",
    description:
      "Rest easy with our bank-level security and transparent payment processing system.",
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Campaign Analytics",
    description:
      "Track your campaign's performance with real-time analytics and actionable insights.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Community Engagement",
    description:
      "Build relationships with backers through updates, comments, and direct messaging.",
  },
  {
    icon: <Smartphone className="h-6 w-6" />,
    title: "Mobile Optimized",
    description:
      "Manage your campaign on the go with our fully responsive mobile experience.",
  },
  {
    icon: <CreditCard className="h-6 w-6" />,
    title: "Low Platform Fees",
    description:
      "Keep more of what you raise with our competitive and transparent fee structure.",
  },
]

export default function Features() {
  return (
    <section className="w-full py-2 md:py-4 lg:py-10 bg-muted/50 ">
      <div className="container px-4 md:px-6 items-center justify-center m-auto">
      <motion.div
          className="flex flex-col items-center justify-center space-y-4 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          <motion.div variants={fadeInUp} className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Why Choose Our Platform
             </h2>
          </motion.div>
          <motion.p
            variants={fadeInUp}
            className="mx-auto w-full text-muted-foreground md:text-xl max-w-2xl"
          >
            We provide all the tools you need to successfully fund your project and connect with supporters.
          </motion.p>
        </motion.div>

        <motion.div
          className="mx-auto grid max-w-5xl grid-cols-1 gap-12 py-12 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="motion-safe:will-change-transform flex flex-col items-center text-center p-6 space-y-4 rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md mx-4"
            >
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
