import type {DirectionInput} from '$/types';
import {classNames} from '$/utils/classNames';
import {NeutralIcon} from './NeutralIcon';

import styles from './DirectionNotationIcon.module.css';

type DirectionNotationIconProps = {
  direction: DirectionInput;
  className?: string;
};

export function DirectionNotationIcon({direction, className}: DirectionNotationIconProps) {
  const transform = getTransformByDirection(direction);

  if (direction === 'n') {
    return <NeutralIcon className={classNames(styles.container, className)} />;
  }

  return (
    <div className={classNames(styles.container, className)}>
      <svg
        style={{transform: transform}}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_31_28)">
          <path d="M20.7683 1.70484C23.3622 -0.868488 27.7985 0.95326 27.7985 4.59175V13.4067H45.2871C46.7854 13.4067 48 14.6112 48 16.097V31.855C48 33.3408 46.7854 34.5453 45.2871 34.5453H27.7985V43.4082C27.7985 47.0467 23.3622 48.8685 20.7683 46.2952L1.20549 26.887C-0.401829 25.2924 -0.401829 22.7076 1.20549 21.113L20.7683 1.70484Z" fill="black"/>
          <path d="M21.5015 2.72167C23.3662 0.885481 26.539 2.19523 26.539 4.80115V14.6558H45.384C46.1599 14.6558 46.7889 15.2796 46.7889 16.049V31.951C46.7889 32.7205 46.1599 33.3443 45.384 33.3443H26.539V43.1028C26.539 45.7087 23.3662 47.0185 21.5015 45.1823L2.05437 26.0314C0.890546 24.8853 0.890543 23.0186 2.05437 21.8725L21.5015 2.72167Z" fill="white"/>
          <path d="M22.3652 6.72931C22.5798 6.52099 22.9415 6.67181 22.9415 6.96967V17.4436C22.9415 17.5497 23.0283 17.6358 23.1353 17.6358H43.4942C43.6013 17.6358 43.688 17.7218 43.688 17.8279V30.1268C43.688 30.2329 43.6013 30.319 43.4942 30.319H23.1353C23.0283 30.319 22.9415 30.405 22.9415 30.5111V40.985C22.9415 41.2829 22.5798 41.4337 22.3652 41.2254L4.84061 24.2177C4.70473 24.0858 4.70473 23.8689 4.84061 23.737L22.3652 6.72931Z" fill="black"/>
          <path d="M21.6379 19.3444C21.6379 19.3709 21.6596 19.3924 21.6864 19.3924H41.8758C41.9025 19.3924 41.9242 19.4139 41.9242 19.4405V28.3763C41.9242 28.4029 41.9025 28.4244 41.8758 28.4244H21.6864C21.6596 28.4244 21.6379 28.4459 21.6379 28.4724V38.2715C21.6379 38.3143 21.5858 38.3357 21.5553 38.3055L7.02985 23.9424C7.01087 23.9236 7.01086 23.8931 7.02985 23.8744L21.5553 9.51125C21.5858 9.48105 21.6379 9.5025 21.6379 9.54527V19.3444Z" fill="white"/>
        </g>
        <defs>
          <clipPath id="clip0_31_28">
            <rect width="48" height="48" fill="white"/>
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function getTransformByDirection(direction: DirectionInput): string {
  const rotationDegrees = getRotationDegreesFromDirection(direction);

  switch (direction) {
    case 'db':
    case 'df':
    case 'ub':
    case 'uf':
      return `rotate(${rotationDegrees}deg) translate(-7%, 0%) scale(1.1)`;
    default:
      return `rotate(${rotationDegrees}deg)`;
  }
}

function getRotationDegreesFromDirection(direction: DirectionInput): number {
  switch (direction) {
    case 'ub':
      return 45;
    case 'u':
      return 90;
    case 'uf':
      return 135;
    case 'f':
      return 180;
    case 'df':
      return -135;
    case 'd':
      return -90;
    case 'db':
      return -45;
    case 'b':
    default:
      return 0;
  }
}
