package filestorage

func (a *Adapter) PublicURL(key string) string {
	return a.PublicUrl + "/" + key
}
