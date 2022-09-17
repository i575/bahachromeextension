const defaultTheme = require('tailwindcss/defaultTheme')
const { rem2px } = require('./deploy-recipe/tailwindcss/rem2px')

module.exports = {
	content: BUILD_TW_CONTENT,
	important: false,
	corePlugins: {
		preflight: false,
	},
	theme: {
		screens: {
			'2xl': { max: '1535px' },
			xl: { max: '1279px' },
			lg: { max: '1023px' },
			md: { max: '767px' },
			sm: { max: '639px' },
			xs: { max: '424px' },
		},
		extend: {
			colors: {
				default: '#000000d9',
				'light-default': '#0000001a',
				success: '#52c41a',
				'light-success': '#52c41a1a',
				primary: '#1890ff',
				'hover-primary': '#40a9ff',
				'light-primary': '#1890ff1a',
				warning: '#faad14',
				'light-warning': '#faad141a',
				danger: '#ff4d4f',
				'light-danger': '#ff4d4f1a',
				secondary: '#00000073',
				disabled: '#00000040',
			},
			borderWidth: rem2px(defaultTheme.borderWidth),
			borderRadius: rem2px(defaultTheme.borderRadius),
			columns: rem2px(defaultTheme.columns),
			fontSize: rem2px(defaultTheme.fontSize),
			lineHeight: rem2px(defaultTheme.lineHeight),
			maxWidth: ({ theme, breakpoints }) => ({
				...rem2px(defaultTheme.maxWidth({ theme, breakpoints })),
			}),
			spacing: rem2px(defaultTheme.spacing),
			width: {
				fit: 'fit-content',
			},
			cursor: {
				grab: 'grab',
			},
			zIndex: {
				1: '1',
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [require('@tailwindcss/line-clamp')],
}
