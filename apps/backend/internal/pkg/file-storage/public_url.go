package filestorage

func (a *Provider) PublicURL(key string) string {
	return a.PublicUrl + "/" + key
}
