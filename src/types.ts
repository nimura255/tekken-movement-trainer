export type DirectionInput = 'd' | 'db' | 'b' | 'ub' | 'u' | 'uf' | 'f' | 'df' | 'n';

export type AttackInput = '1' | '2' | '3' | '4' | '12' | '13' | '14' | '23' | '24' | '34' | '123' | '124' | '234' | '1234';

export type AttackMoveInput = `${DirectionInput | ''}${AttackInput | ''}`;
