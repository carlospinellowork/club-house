import { render, screen } from '@testing-library/react'
import HomePage from './page'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

// Mock HeaderClient
jest.mock('./_components/header-client', () => {
  return function MockHeaderClient() {
    return <div data-testid="header-client">Header</div>
  }
})

describe('HomePage', () => {
  it('renders the main heading', () => {
    render(<HomePage />)
    const heading = screen.getByText(/Onde o seu/i)
    expect(heading).toBeInTheDocument()
    expect(screen.getByText(/coração/i)).toBeInTheDocument()
    expect(screen.getByText(/bate mais forte/i)).toBeInTheDocument()
  })

  it('renders the call to action buttons', () => {
    render(<HomePage />)
    expect(screen.getByText(/Entrar Agora/i)).toBeInTheDocument()
    expect(screen.getByText(/Cadastre-se/i)).toBeInTheDocument()
  })

  it('renders the features section', () => {
    render(<HomePage />)
    expect(screen.getByText(/Comunidade Vibrante/i)).toBeInTheDocument()
    expect(screen.getByText(/Atualizações em Tempo Real/i)).toBeInTheDocument()
  })
})
