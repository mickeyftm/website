import { createUseStyles } from 'react-jss';

import { Theme } from 'src/common';

export const useLayoutFooterStyles = createUseStyles<Theme>((theme) => ({
	footer: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 40,

		[theme.breakpoints.md()]: {
			marginBottom: 64
		}
	}
}));
