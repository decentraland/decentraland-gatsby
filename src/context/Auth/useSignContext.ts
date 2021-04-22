import useSign from "../../hooks/useSign";
import useAuthContext from "./useAuthContext";

export default function useSignContext() {
  const [ address, state ] = useAuthContext()
  return useSign(address, state.provider)
}