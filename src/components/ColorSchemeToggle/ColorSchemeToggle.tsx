import { ActionIcon, useMantineColorScheme, useComputedColorScheme, rem } from '@mantine/core';
import cx from 'clsx';
import classes from './ColorSchemeToggle.module.css';
import { Moon, Sun } from '@phosphor-icons/react/dist/ssr';
import navBarClasses from '../NavBar/NavBar.module.css';

export const ColorSchemeToggle = () => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  return (
    <ActionIcon
      onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
      variant="subtle"
      size={rem(50)}
      aria-label="Toggle color scheme"
      className={navBarClasses.link}
    >
      <Sun className={cx(classes.light, navBarClasses.icon)} />
      <Moon className={cx(classes.dark, navBarClasses.icon)}  />
    </ActionIcon>
  );
};


