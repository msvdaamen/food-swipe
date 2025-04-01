import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/recipes/ingredients')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_layout/recipes/ingredients"!</div>
}
