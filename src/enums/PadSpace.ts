enum PadSpace {
  None = 1 << 0,
  Left = 1 << 1,
  Right = 1 << 2,
  Both = PadSpace.Left | PadSpace.Right,
}

export default PadSpace;
