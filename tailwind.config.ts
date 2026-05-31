
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Rancho Prado Premium Theme Colors
				'rio-blue': '#12344D',      // Azul Rio Profundo
				'water-green': '#355E3B',    // Verde Mata
				'sand-beige': '#F5E6C8',     // Areia Natural
				'sunset-orange': '#D4A017',   // Dourado Velho
				'ice-white': '#FAFAFA',      // Branco Gelo
				'premium-graphite': '#1D1D1D',// Grafite Premium
				'river': {
					50: '#f0f7fc',
					100: '#e0eff9',
					200: '#bae0f3',
					300: '#7dc2e8',
					400: '#38a0d9',
					500: '#12344D', // Azul Rio Profundo
					600: '#0e2b40',
					700: '#0b2132',
					800: '#071824',
					900: '#040e16',
				},
				'nature': {
					50: '#f2f8f3',
					100: '#e2f0e4',
					200: '#cbe2ce',
					300: '#a7cdab',
					400: '#7bb081',
					500: '#355E3B', // Verde Mata
					600: '#2b4d30',
					700: '#223c26',
					800: '#192b1b',
					900: '#101b11',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'float': {
					'0%, 100%': { 
						transform: 'translateY(0px)'
					},
					'50%': { 
						transform: 'translateY(-10px)'
					}
				},
				'wave': {
					'0%, 100%': { 
						transform: 'scaleY(1)'
					},
					'50%': { 
						transform: 'scaleY(1.1)'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 3s ease-in-out infinite',
				'wave': 'wave 2s ease-in-out infinite',
				'fade-in': 'fade-in 0.6s ease-out',
			},
			backgroundImage: {
				'river-gradient': 'linear-gradient(135deg, #12344D 0%, #355E3B 100%)',
				'sunset-gradient': 'linear-gradient(135deg, #D4A017 0%, #12344D 100%)',
			}
		}
	},
	plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
