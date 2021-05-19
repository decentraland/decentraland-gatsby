import useEth from "../../hooks/useEth";
import useAuthContext from "./useAuthContext";

export default function useEthContext() {
  const [ _account, state ] = useAuthContext()
  return useEth(state.provider)
}