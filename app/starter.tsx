import Starter from "@/screens/starter";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

export default () => (
  <GluestackUIProvider mode="light">
    <Starter />
  </GluestackUIProvider>
);