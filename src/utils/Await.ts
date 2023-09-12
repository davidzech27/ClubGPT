import { use } from "react"

interface Props<TResolved> {
	promise: Promise<TResolved>
	children: (resolved: TResolved) => React.ReactNode
}

export default function Await<TResolved>({
	promise,
	children,
}: Props<TResolved>) {
	return children(use(promise))
}
