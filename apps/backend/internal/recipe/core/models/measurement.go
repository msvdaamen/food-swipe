package models

type Measurement struct {
	ID           uint16
	Name         string
	Abbreviation string
}

type ListMeasurements struct {
	Limit  uint32
	Page   uint32
	Search *string
}

type CreateMeasurement struct {
	Name         string
	Abbreviation string
}

type UpdateMeasurement struct {
	Name         string
	Abbreviation string
}
